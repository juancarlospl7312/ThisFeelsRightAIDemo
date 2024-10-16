import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

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
  // Hardcoded API keys (replace these with real values)
  private googleApiKey = "AIzaSyDg6_dfOSOyJM8PpzmafDUG7He9k_5SgSY";
  private cseId = "e6eeb36a1359c42ff";

  // ScraperAPI key
  private scraperApiKey = "6d599e976d6915f50dff4f9f4f9103d0";

  constructor(private http: HttpClient) {}

  searchWithGoogle(query: string): Observable<GoogleSearchResult[]> {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query
    )}&key=${this.googleApiKey}&cx=${this.cseId}`;

    return this.http.get<GoogleSearchResponse>(url).pipe(
      map((response) => response.items || []),
      catchError((error) => {
        console.error("Google Search Error:", error);
        return of([]);
      })
    );
  }

  fetchPageContent(link: string): Observable<string> {
    const scraperApiUrl = `http://api.scraperapi.com?api_key=${
      this.scraperApiKey
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
