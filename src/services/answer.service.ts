import { Injectable } from "@angular/core";
import {Observable, of, forkJoin, delay} from "rxjs";
import { map, catchError, switchMap } from "rxjs/operators";
import { SearchService } from "./search.service";
import { OpenAIService } from "./openAI.service";

@Injectable({
  providedIn: "root",
})
export class AnswerService {
  constructor(
    private searchService: SearchService,
    private openAIService: OpenAIService
  ) {}

  processRequest(
    message: string,
    returnSources: boolean = true
  ): Observable<any> {
    return this.searchService.searchWithGoogle(message).pipe(
      switchMap((sources) => {
        if (sources.length === 0) {
          return of({
            status: 404,
            body: { error: "No relevant sources found." },
          });
        }

        const processedSources$ = sources.map(({ title, link }) =>
            {
                delay(3000);
                return this.searchService.fetchPageContent(link).pipe(
                    switchMap((htmlContent) => {
                        if (!htmlContent || htmlContent.length < 250) return of(null);
                        return of({ title, link, content: htmlContent });
                    })
                )
            }
        );

        return forkJoin(processedSources$).pipe(
          map((processedSources) => processedSources.filter(Boolean)),
          switchMap((validSources: any[]) => {
            const summaryRequests$ = validSources.map((source) =>
              this.openAIService.generateIndividualSummary(source.content).pipe(
                map((summary) => ({
                  title: source.title,
                  link: source.link,
                  summary,
                }))
              )
            );

            return forkJoin(summaryRequests$).pipe(
              switchMap((briefSummaries: any[]) =>
                this.openAIService.generateGeneralSummary(briefSummaries).pipe(
                  map((generalSummary) => {
                    const responseObj: any = {
                      generalSummary,
                      briefSummaries,
                    };
                    if (returnSources) responseObj.sources = sources;
                    return { status: 200, body: responseObj };
                  })
                )
              )
            );
          })
        );
      }),
      catchError((error) => {
        console.error("Error in processRequest:", error);
        return of({ status: 500, body: { error: "Something went wrong." } });
      })
    );
  }
}
