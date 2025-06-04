import { Routes } from '@angular/router';
import { AuthSignupComponent } from './pages/auth-signup/auth-signup.component';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { MyBlogsComponent } from './my-blogs/my-blogs.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'signup', component: AuthSignupComponent },
  { path: 'login', component: AuthLoginComponent },
  { path: 'blogs', component: BlogListComponent },
  { path: 'create-blog', component: BlogPostComponent },
  { path: 'blog/:id', component: BlogDetailComponent },
  {
    path: 'blog/edit/:id',
    component: BlogPostComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
    {
    path: 'my-blogs',
    component: MyBlogsComponent,
  },
];
