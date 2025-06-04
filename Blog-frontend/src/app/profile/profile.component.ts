import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../services/blog.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  myBlogCount: number = 0;
  editMode = false;
  loading = true;
  error: string = '';
  email: string = '';
  blogTitle: string = '';
  blogDescription: string = '';
  blogBanner: string = '';
  username: string = '';
  constructor(
    private blogService: BlogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
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

          console.log(this.user);
        },
        error: () => {},
      });
    }
    this.fetchProfile();
    this.fetchMyBlogs();
  }

  fetchProfile() {
    this.blogService.getMyProfile().subscribe({
      next: (res) => {
        //this.user = res;
        this.email = res.email;
        this.blogTitle = res.blogTitle;
        this.blogDescription = res.blogDescription;
        this.blogBanner = res.blogBanner;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile';
        this.loading = false;
      },
    });
  }

  fetchMyBlogs() {
    this.blogService.getMyBlogs().subscribe({
      next: (blogs) => {
        this.myBlogCount = blogs.length;
      },
      error: () => {
        this.myBlogCount = 0;
      },
    });
  }

  saveProfile() {
    const body = {
      blogTitle: this.blogTitle,
      blogDescription: this.blogDescription,
      blogBanner: this.blogBanner,
    };

    this.blogService.updateProfile(body).subscribe({
      next: (res) => {
        // this.user = res;
        this.editMode = false;
        this.fetchProfile();
      },
      error: () => {
        this.error = 'Failed to update profile';
      },
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  dropdownVisible = false;
  logout() {
    localStorage.removeItem('token');
    this.user = null;
    this.dropdownVisible = false;
  }
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  closeDropdownOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.dropdownVisible = false;
    }
  }
}