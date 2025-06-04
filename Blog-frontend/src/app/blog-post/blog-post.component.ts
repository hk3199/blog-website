import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
  ],
  templateUrl: './blog-post.component.html',
})
export class BlogPostComponent implements OnInit {
  postForm: FormGroup;
  isEditMode = false;
  blogId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.postForm = this.fb.group({
      title: [''],
      content: [''],
    });
  }

  username: string = '';

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.blogId;

    if (this.isEditMode && this.blogId) {
      this.blogService.getBlogById(this.blogId).subscribe((blog) => {
        this.postForm.patchValue({
          title: blog.title,
          content: blog.content,
        });
      });
    }

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
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const { title, content } = this.postForm.value;

      if (this.isEditMode && this.blogId) {
        this.blogService.update(this.blogId, title, content).subscribe({
          next: () => this.router.navigate(['/blogs']),
          error: (err) => console.error('Error updating blog', err),
        });
      } else {
        this.blogService.create(title, content).subscribe({
          next: () => this.router.navigate(['/blogs']),
          error: (err) => console.error('Error posting blog', err),
        });
      }
    }
  }
  imagePreview: string | ArrayBuffer | null = null;
  selectedImageFile: File | null = null;

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.selectedImageFile = file;
    }
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
