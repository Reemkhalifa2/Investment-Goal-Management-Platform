import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { investmentGoalRequest, investmentGoalResponse } from '../models/investmentGoal-models';

@Injectable({
  providedIn: 'root',
})
export class investmentGoalService {
  private readonly apiUrl = 'http://localhost:8080/api/financial-goals';

  constructor(private http: HttpClient) {}

  list(userId: number): Observable<investmentGoalResponse[]> {
    return this.http.get<investmentGoalResponse[]>(`${this.apiUrl}?userId=${userId}`);
  }

  save(goal: investmentGoalRequest): Observable<investmentGoalResponse> {
    return this.http.post<investmentGoalResponse>(this.apiUrl, goal);
  }
}