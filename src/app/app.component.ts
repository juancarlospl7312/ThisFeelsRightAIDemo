import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {BehaviorSubject, combineLatest, filter, map, Observable, shareReplay, Subject} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";
import {AsyncPipe, CommonModule} from "@angular/common";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterOutlet,
        CommonModule,
        AsyncPipe,
        RouterLink,
    ],

})
export class AppComponent implements OnInit, OnDestroy {

    public isProcessing: boolean = false;
    private readonly _destroying$ = new Subject<void>();

    /**
     * Stores value indicating is the user has intentionally opened the nav bar
     */
    private _userOpenedNavBar = new BehaviorSubject<boolean>(false);

    constructor(
        private breakpointObserver: BreakpointObserver,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title
    ) {}

    ngOnDestroy(): void {
        this._destroying$.next(undefined);
        this._destroying$.complete();
    }

    ngOnInit(): void {

    }

    /**
     * Indicates if the current screen size is mobile or thereabouts
     */
    public isMobile$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 1023.98px)')
        .pipe(
            map(breakpointState => breakpointState.matches)
        );
}