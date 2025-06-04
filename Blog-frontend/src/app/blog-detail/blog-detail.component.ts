import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule,RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog: any;
  loading = true;
  error: string | null = null;
  loggedInUserEmail: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loggedInUserEmail = this.authService.getUserEmail();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogService.getBlogById(id).subscribe({
        next: (data) => {
          this.blog = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load blog';
          this.loading = false;
        }
        
      });
    }
  }

  isOwner(): boolean {
    return this.blog?.createdBy?.email === this.loggedInUserEmail;
  }
  
  onDelete(blogid: string): void {

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogService.delete(id).subscribe({
        next: (res) => {       
          this.router.navigate(['/blogs']);
        },
        error: () => {
          this.error = 'Failed to delete blog';
          this.loading = false;
          this.snackBar.open('Failed to delete blog', 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }
}



