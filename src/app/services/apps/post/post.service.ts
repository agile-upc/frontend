import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Post } from 'src/app/shared/model/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private environmentUrl = '';

  constructor(private httpClient: HttpClient) {
    this.environmentUrl = `${environment.apiUrl}/posts`;
  }

  public getPosts(advisorId?: number): Observable<Post[]> {
    const url = advisorId ? `${this.environmentUrl}?advisorId=${advisorId}` : this.environmentUrl;
    return this.httpClient.get<Post[]>(url);
  }

  public getPostById(id: number): Observable<Post> {
    return this.httpClient.get<Post>(`${this.environmentUrl}/${id}`);
  }

  public createPost(post: Post): Observable<Post> {
    return this.httpClient.post<Post>(this.environmentUrl, post);
  }

  public updatePost(id: number, post: Post | FormData): Observable<Post> {
    return this.httpClient.put<Post>(`${this.environmentUrl}/${id}`, post);
  }


  deletePost(id: number): Observable<any> {
    return this.httpClient.delete(`${this.environmentUrl}/${id}`, { responseType: 'text' });
  }

}
