import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

interface OpenAIMessage {
  role: string;
  content: string;
}

interface OpenAIChoice {
  message: OpenAIMessage;
}

interface OpenAIResponse {
  choices: OpenAIChoice[];
}

@Injectable({
  providedIn: "root",
})
export class OpenAIService {
  private openAiApiKey = "openAiApiKey";
  private apiUrl = "https://api.openai.com/v1/chat/completions";

  constructor(private http: HttpClient) {}

  generateIndividualSummary(content: string): Observable<string> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.openAiApiKey}`,
    });

    const body = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Summarize the following article briefly." },
        { role: "user", content },
      ],
    };

    return this.http.post<OpenAIResponse>(this.apiUrl, body, { headers }).pipe(
      map((response) => response.choices[0].message.content.trim()),
      catchError((error) => {
        console.error("OpenAI Error:", error);
        return of("");
      })
    );
  }

  generateGeneralSummary(articles: any[]): Observable<string> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.openAiApiKey}`,
    });

    const body = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Summarize the following articles into a coherent summary.",
        },
        { role: "user", content: JSON.stringify(articles) },
      ],
    };

    return this.http.post<OpenAIResponse>(this.apiUrl, body, { headers }).pipe(
      map((response) => response.choices[0].message.content.trim()),
      catchError((error) => {
        console.error("OpenAI Error:", error);
        return of("");
      })
    );
  }
}
