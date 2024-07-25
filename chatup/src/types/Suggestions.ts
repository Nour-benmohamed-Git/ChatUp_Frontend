export interface FriendSuggestionResponse {
  id: number;
  username: string;
  email: string;
  profilePicture?: string;
  mutualFriendsImages?: string[];
}

export interface FriendSuggestionsResponse {
  data: FriendSuggestionResponse[];
  total: number;
}
