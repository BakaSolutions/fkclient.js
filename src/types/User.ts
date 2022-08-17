export type User = {
	email: string
	expiredAt: string
	groups: string[]
	name: string
	privileges: {
		newBoardsPerMinute: number
		newGroupsPerMinute: number
		newInvitesPerMinute: number
	}
	registeredAt: string
}
