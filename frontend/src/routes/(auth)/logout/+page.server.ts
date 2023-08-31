export function load({ cookies }) {
	cookies.delete('user_id');
	cookies.delete('username');
	cookies.delete('access');
	cookies.delete('refresh');
}
