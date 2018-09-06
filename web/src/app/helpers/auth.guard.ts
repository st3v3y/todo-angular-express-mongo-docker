import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        // return new Promise<boolean>(() => {
        //     const subscription = this.userService.getLoggedIn().do(
        //         () => {
        //             console.log('user logged in!');
        //             return true;
        //         },
        //         () => {
        //             console.log('user NOT logged in!');
        //             this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        //             return false;
        //         }
        //     );
        //     subscription.unsubscribe();
        // });

        return this.userService.getLoggedIn()
            .pipe(
                tap((isLoggedIn: boolean) => {
                    if (!isLoggedIn) {
                        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    }
                }
            ));
    }
}
