import { BaseItemDto, BaseItemKind, ItemSortBy, SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { QueryConfig } from "../query.config";
import Client from "../../client";

export function fetchRecentlyPlayed(offset?: number | undefined): Promise<BaseItemDto[]> {

    console.debug("Fetching recently played items");

    return new Promise(async (resolve, reject) => {
        getItemsApi(Client.api!)
        .getItems({ 
            includeItemTypes: [
                BaseItemKind.Audio
            ],
            startIndex: offset,
            limit: QueryConfig.limits.recents,
            parentId: Client.library!.musicLibraryId, 
            recursive: true,
            sortBy: [ 
                ItemSortBy.DatePlayed 
            ], 
            sortOrder: [
                SortOrder.Descending
            ],
        })
        .then((response) => {

            console.debug("Received recently played items response");

            if (response.data.Items)
                resolve(response.data.Items);
            else
                resolve([]);
            
        }).catch((error) => {
            console.error(error);
            reject(error);
        })
    })
}

export function fetchRecentlyPlayedArtists(offset?: number | undefined) : Promise<BaseItemDto[]> {
    return fetchRecentlyPlayed(offset)
        .then((tracks) => {
            return getItemsApi(Client.api!)
                .getItems({ 
                    ids: tracks.map(track => track.ArtistItems![0].Id!) 
                })
                .then((recentArtists) => {
                    return recentArtists.data.Items!
                });
        });
}