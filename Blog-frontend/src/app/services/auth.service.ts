import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';

export interface DecodedToken {
  email: string;
  userId: string;
  username: string;
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  signup(username: string, email: string, password: string) {
    return this.http.post(`${environment.apiUrl}/users/signup`, { username, email, password });
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/users/login`, { email, password })
      .pipe(tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
      }));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Add inside your AuthService class

getDecodedToken(): DecodedToken | null {
  const token = this.getToken();
  console.log('Token: now', token);
  if (token) {
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }
  return null;
}

getUserEmail(): string | null {
  const decoded = this.getDecodedToken();
  console.log('Decoded token:', decoded);
  return decoded?.email || null;
}

getUserId(): string | null {
  const decoded = this.getDecodedToken();
  return decoded?.userId || null;
}



}
