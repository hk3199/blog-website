import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService } from '../services/blog.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent implements OnInit {
  blogs: any[] = [];
  myBlogs: any[] = [];
  myBlogsCount: number = 0;
  loading: boolean = false;
  error: string | null = null;

  currentPage: number = 1;
  totalPages: number = 1;
  totalBlogs: number = 0;
  limit: number = 5;
  username: string = '';
  constructor(
    private blogService: BlogService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchBlogs();
    this.fetchMyBlogs();
    const token = localStorage.getItem('token');
    if (token) {
      // const decoded: any = this.jwtHelper.decodeToken(token);
      this.blogService.getMyProfile().subscribe({
        next: (res) => {
          console.log(res);
          this.username = res.username;
          this.user = {
            email: this.authService.getUserEmail(),
            username: this.username,
          };
        },
        error: () => {},
      });
    }
  }

  fetchBlogs(): void {
    this.loading = true;
    this.error = null;

    this.blogService.getAll(this.currentPage, this.limit).subscribe({
      next: (data) => {
        this.blogs = data.blogs;
        const totalCount = data.totalBlogs || 0;
        this.totalPages = Math.ceil(totalCount / this.limit);
        this.totalBlogs = data.totalBlogs;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load blogs.';
        this.loading = false;
      },
    });
  }

  fetchMyBlogs(): void {
    this.loading = true;
    this.error = null;

    this.blogService.getMyBlogs().subscribe({
      next: (data) => {
        this.myBlogs = data;
        this.myBlogsCount = data.length;
        this.loading = false;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load blogs.';
        this.loading = false;
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchBlogs();
    }
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
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
    this.router.navigate(['/login']);
  }
}

// fetchBlogs(): void {
//   this.loading = true;
//   this.error = null;

//   this.blogService.getAll().subscribe({
//     next: (data) => {
//       this.blogs = data;
//       this.loading = false;
//     },
//     error: (err) => {
//       this.error = 'Failed to load blogs.';
//       this.loading = false;
//     }
//   });
// }
// }
