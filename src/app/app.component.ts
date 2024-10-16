import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { map, Observable, of, Subject } from "rxjs";
import { BreakpointObserver } from "@angular/cdk/layout";
import { AsyncPipe, CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { AnswerService } from "../services/answer.service";
import { BriefSummary } from "../models/brief-summary";
import { Source } from "../models/source";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { catchError } from "rxjs/operators";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AsyncPipe,
    RouterLink,
    MatIconModule,
    MatInputModule,
    MatLabel,
    MatButtonModule,
    MatListModule,
    MatCardModule,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild("generalSummaryContent", { static: false })
  generalSummaryContent: ElementRef;

  private readonly _destroying$ = new Subject<void>();
  public demoForm: FormGroup;
  public generalSummary: string = "";
  public briefSummaries: Observable<BriefSummary[]> = of([]);
  public sources: Observable<Source[]> = of([]);
  public showAnswer: boolean = false;
  public showMoreBtn: boolean = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private answerService: AnswerService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }

  public initializeForm(): void {
    this.demoForm = this.formBuilder.group({
      question: new FormControl<string | null>(null),
    });
  }

  public search(): void {
    const question = this.demoForm.get("question")?.value;
    if (!question) return;

    this.briefSummaries = of([]);
    this.sources = of([]);
    this.showAnswer = false;

    this.answerService
      .processRequest(question, true)
      .pipe(
        catchError((error) => {
          console.error("Error in search:", error);
          return of({
            generalSummary: "",
            briefSummaries: [],
            sources: [],
          });
        })
      )
      .subscribe((response) => {
        const { generalSummary, briefSummaries, sources } = response.body;

        this.generalSummary = generalSummary;
        this.briefSummaries = of(briefSummaries);
        this.sources = of(sources);
        this.showAnswer = true;

        if (this.generalSummaryContent) {
          this.showMoreBtn = true;
          this.generalSummaryContent.nativeElement.style.setProperty(
            "-webkit-line-clamp",
            "2"
          );
        }
      });
  }

  public showMore(): void {
    if (this.generalSummaryContent) {
      this.showMoreBtn = false;
      this.generalSummaryContent.nativeElement.style.setProperty(
        "-webkit-line-clamp",
        "initial"
      );
    }
  }

  public isMobile$: Observable<boolean> = this.breakpointObserver
    .observe("(max-width: 1023.98px)")
    .pipe(map((breakpointState) => breakpointState.matches));
}
