import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Blog {
  _id: string;
  title: string;
  content: string;
  createdBy: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface PaginatedBlogResponse {
  blogs: Blog[];
  totalBlogs: number;
  totalPages: number;
  currentPage: number;
}

export interface MyBlogInterface {
  _id: string;
  title: string;
  content: string;
 // createdBy:;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(private http: HttpClient) {}

  getAll(page: number, limit: number) {
    return this.http.get<PaginatedBlogResponse>(`${environment.apiUrl}/blog/list?page=${page}&limit=${limit}`);
  }

  getBlogById(id: string) {
    const token = localStorage.getItem('token');  // Adjust this if your token is stored elsewhere

    // If no token, throw an error or handle it accordingly
    if (!token) {
      throw new Error('No token found');
    }

    // Set the token in the Authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(token)

    return this.http.get<Blog>(`${environment.apiUrl}/blog/${id}`,  { headers });
  }

  getMyBlogs() {
    const token = localStorage.getItem('token');  // Adjust this if your token is stored elsewhere

    // If no token, throw an error or handle it accordingly
    if (!token) {
      throw new Error('No token found');
    }

    // Set the token in the Authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(token)
    return this.http.get<MyBlogInterface[]>(`${environment.apiUrl}/blog/`, { headers });
  }

  create(title: string, content: string) {  // Get the token from local storage
    const token = localStorage.getItem('token');  // Adjust this if your token is stored elsewhere

    // If no token, throw an error or handle it accordingly
    if (!token) {
      throw new Error('No token found');
    }

    // Set the token in the Authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(token)
    return this.http.post<Blog>(`${environment.apiUrl}/blog`, { title, content }, { headers });
  }

  update(id: string, title: string, content: string) {
    const token = localStorage.getItem('token');  // Adjust this if your token is stored elsewhere

    // If no token, throw an error or handle it accordingly
    if (!token) {
      throw new Error('No token found');
    }

    // Set the token in the Authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Blog>(`${environment.apiUrl}/blog/${id}`, { title, content }, { headers });
  }

  delete(id: string) {
    const token = localStorage.getItem('token');  
    if (!token) {
      throw new Error('No token found');
    }

    // Set the token in the Authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${environment.apiUrl}/blog/${id}`, { headers });
  }

  getMyProfile(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${environment.apiUrl}/users/profile`, { headers });
}

updateProfile(body: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  console.log(token)
    return this.http.put(`${environment.apiUrl}/users/profile`, body, { headers })
}

}
