import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {AiAnswer} from "../../../pages/apps/farmer/catalog/ai-answer";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private environmentUrl = '';

  constructor(private httpClient: HttpClient) {
    this.environmentUrl = `${environment.apiUrl}/ai`;
  }

  public sendMessage(message: string, conversationId: string | null = null): Observable<AiAnswer> {
    return this.httpClient.post<AiAnswer>(this.environmentUrl + `/recommendations`, {
      message,
      conversationId
    }).pipe(
      map(dto => AiAnswer.fromDto(dto))
    );
  }
}
