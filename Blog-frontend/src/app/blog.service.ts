import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private http: HttpClient) {}

  createBlog(blog: { title: string; content: string }): Observable<any> {
    return this.http.post('http://localhost:5000/api/blog', blog);
  }
}
