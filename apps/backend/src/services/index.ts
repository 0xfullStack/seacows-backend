import { ReservoirHttpApi } from "./reservoir/httpApi";
import { ReservoirHttpClientManager } from "./reservoir/httpClientManager";

export interface ExternalServices {
  reservoirApi: ReservoirHttpApi;
  // looksrareApi: LooksRareHttpApi;
}

export class ExternalServices implements ExternalServices{
  private constructor(reservoirApiKeys: string[]) {
    const reservoirHttpClient = new ReservoirHttpClientManager(reservoirApiKeys);
    
    this.reservoirApi = new ReservoirHttpApi(reservoirHttpClient);
  }

  static apply(reservoirApiKeys: string[]): ExternalServices {
    return new ExternalServices(reservoirApiKeys);
  }
}
