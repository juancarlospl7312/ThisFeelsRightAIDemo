import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {environment as env} from "../environments/environment";

// Interfaces to define the expected Google Search API response
interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
}

interface GoogleSearchResponse {
  items?: GoogleSearchResult[];
}

@Injectable({
  providedIn: "root",
})
export class SearchService {


  constructor(private http: HttpClient) {}

  searchWithGoogle(query: string): Observable<GoogleSearchResult[]> {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query
    )}&key=${env.GOOGLE_API_KEY}&cx=${env.CSE_ID}`;

    return this.http.get<GoogleSearchResponse>(url).pipe(
      map((response) => response.items || []),
      catchError((error) => {
        console.error("Google Search Error:", error);
        return of([]);
      })
    );
  }

  fetchPageContent(link: string): Observable<string> {
    const scraperApiUrl = `https://api.scraperapi.com?api_key=${
      env.SCRAPER_API_KEY
    }&url=${encodeURIComponent(link)}`;

    return this.http.get(scraperApiUrl, { responseType: "text" }).pipe(
      map((htmlContent) => this.extractMainContent(htmlContent)),
      catchError((error) => {
        console.error(`Error fetching content from ${link}`, error);
        return of("");
      })
    );
  }

  private extractMainContent(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const paragraphs = Array.from(doc.querySelectorAll("p")).map(
      (el) => el.textContent || ""
    );
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3")).map(
      (el) => el.textContent || ""
    );

    return [...headings, ...paragraphs].join(" ").replace(/\s+/g, " ").trim();
  }
}
