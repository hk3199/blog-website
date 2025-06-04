import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService } from '../services/blog.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-my-blogs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-blogs.component.html',
  styleUrls: ['./my-blogs.component.css']
})
export class MyBlogsComponent implements OnInit {
  blogTitle: string = '';
  blogDescription: string = '';
  blogBanner: string = '';
  blogs: any[] = [];
  loading = true;
  username: string = '';
  authorName: string = 'Himanshu';

  constructor(private blogService: BlogService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchProfile();
    this.fetchMyBlogs();
          const token = localStorage.getItem('token');
      if (token) {
   // const decoded: any = this.jwtHelper.decodeToken(token);
    this.blogService.getMyProfile().subscribe({
      next: (res) => {
        console.log(res);
        this.username = res.username;
        this.user = { email: this.authService.getUserEmail(), username: this.username  };

    
    console.log(this.user)
      },
      error: () => {}
    });
  }
  }

  fetchProfile() {
    this.blogService.getMyProfile().subscribe({
      next: (res) => {
        this.blogTitle = res.blogTitle;
        this.blogDescription = res.blogDescription;
        this.blogBanner = res.blogBanner;
      },
      error: () => {
        this.blogTitle = '';
        this.blogDescription = '';
        this.blogBanner = '';
      }
    });
  }

  fetchMyBlogs() {
    this.blogService.getMyBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.loading = false;
      },
      error: () => {
        this.blogs = [];
        this.loading = false;
      }
    });
  }

  dropdownVisible = false;
user: any;

toggleDropdown() {
  this.dropdownVisible = !this.dropdownVisible;
}

closeDropdownOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.user-dropdown')) {
    this.dropdownVisible = false;
  }
}

decodeToken(token: string): any {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
}

logout() {
  localStorage.removeItem('token');
  this.user = null;
  this.dropdownVisible = false;
  this.router.navigate(['/login'])
}
}
