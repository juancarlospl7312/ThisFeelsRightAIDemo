import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {catchError, map, Observable, of, Subject} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";
import {AsyncPipe, CommonModule} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {AnswerService} from "../services/answer.service";
import {BriefSummary} from "../models/brief-summary";
import {Source} from "../models/source";
import {MatListModule} from "@angular/material/list";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
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
        MatListModule
    ],
    providers: []
})
export class AppComponent implements OnInit, OnDestroy {

    private readonly _destroying$ = new Subject<void>();
    public demoForm: FormGroup;
    public generalSummary: string;
    public briefSummaries: Observable<BriefSummary[]>;
    public sources: Observable<Source[]>

    constructor(
        private breakpointObserver: BreakpointObserver,
        private formBuilder: FormBuilder,
        private answerService: AnswerService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
    }

    ngOnDestroy(): void {
        this._destroying$.next(undefined);
        this._destroying$.complete();
    }

    public initializeForm() {
        this.demoForm = this.formBuilder.group({
            question: new FormControl<string | null>(null, {})
        });
    }

    public search(): void {
        this.briefSummaries = this.answerService.getAnswer(this.demoForm.get('question')?.value)
            .pipe(
                map(response => response.briefSummaries),
                catchError(() => of([]))
            );
    }

    /**
     * Indicates if the current screen size is mobile or thereabouts
     */
    public isMobile$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 1023.98px)')
        .pipe(
            map(breakpointState => breakpointState.matches)
        );
}