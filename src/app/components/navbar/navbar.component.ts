import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false; // keeps track og login status
  activeLink: string = ''; //holds current active route link
  isWideScreen = true; //conditional display 

  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {
    this.checkScreenWidth();
  }

  //listening for resizing evt
  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenWidth();
  }


  checkScreenWidth() {
    this.isWideScreen = window.innerWidth > 600;
  }


  ngOnInit(): void {
    this.checkScreenWidth();
    this._authService.loggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
    this._router.events // listens for navigation events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd))//filters the events to only include NavigationEnd
      .subscribe((event: NavigationEnd) => { //it updates this.activeLink with the current URL after redirection, keeping track of the current route.
        this.activeLink = event.urlAfterRedirects; // store the current URL
      });
  }


  isActive(link: string): boolean {//returns true if the current URL  stored in activeLink ends with the provided link
    return this.activeLink.endsWith(link);
  }


  onLogout() {
    this._authService.logout();
    this._router.navigate(['/login']); // redirect to login on success
    //  this.loginForm.reset(); 
  }

}
