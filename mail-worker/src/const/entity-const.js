import verifyRecordService from '../service/verify-record-service';

export const userConst = {
	status: {
		NORMAL: 0,
		BAN: 1
	}
}

export const accountConst = {
	allReceive: {
		CLOSE: 0,
		OPEN: 1
	}
}

export const roleConst = {
	isDefault: {
		CLOSE: 0,
		OPEN: 1
	},
	banEmailType: {
		ALL: 0,
		CONTENT: 1
	},
	sendType: {
		COUNT: 'count',
		DAY: 'day'
	}
}

export const permConst = {
	type: {
		BUTTON: 2,
	}
}

export const emailConst = {
	type: {
		SEND: 1,
		RECEIVE: 0
	},
	status:  {
		RECEIVE: 0,
		SENT: 1,
		DELIVERED: 2,
		BOUNCED: 3,
		COMPLAINED: 4,
		DELAYED: 5,
		SAVING: 6,
		NOONE: 7,
		FAILED: 8
	},
	unread: {
		UNREAD: 0,
		READ: 1
	}
}

export const attConst = {
	status: {
		NORMAL: 0,
		UNUSED: 1
	},
	type: {
		ATT: 0,
		EMBED: 1
	}
}

export const settingConst = {
	register: {
		OPEN: 0,
		CLOSE: 1,
	},
	regKey: {
		OPEN: 0,
		CLOSE: 1,
		OPTIONAL: 2,
	},
	receive: {
		OPEN: 0,
		CLOSE: 1,
	},
	send: {
		OPEN: 0,
		CLOSE: 1
	},
	addEmail: {
		OPEN: 0,
		CLOSE: 1
	},
	manyEmail: {
		OPEN: 0,
		CLOSE: 1,
	},
	registerVerify: {
		OPEN: 0,
		CLOSE: 1,
		COUNT: 2,
	},
	addEmailVerify: {
		OPEN: 0,
		CLOSE: 1,
		COUNT: 2,
	},
	forwardStatus: {
		OPEN: 0,
		CLOSE: 1,
	},
	tgBotStatus: {
		OPEN: 0,
		CLOSE: 1,
	},
	ruleType: {
		ALL: 0,
		RULE: 1
	},
	noRecipient: {
		OPEN: 0,
		CLOSE: 1,
	},
	kvStorage: {
		OPEN: 0,
		CLOSE: 1
	},
	forcePathStyle: {
		OPEN: 0,
		CLOSE: 1
	},
	authRefresh: {
		OPEN: 1,
		CLOSE: 0
	}
}

export const verifyRecordType = {
	REG: 0,
	ADD: 1,
}


export const isDel = {
	DELETE: 1,
	NORMAL: 0
}

export const identityConst = {
	status: {
		ACTIVE: 0,
		STOPPED: 1,
		INACTIVE: 2
	},
	aliasType: {
		MAIN: 0,
		ALIAS: 1
	},
	category: {
		DEV: 'dev',
		AI: 'ai',
		SAAS: 'saas',
		SOCIAL: 'social',
		CLOUD: 'cloud',
		WEB3: 'web3',
		FINANCE: 'finance',
		SHOP: 'shop',
		NEWS: 'news',
		OTHER: 'other'
	}
}

export const analysisConst = {
	category: {
		REGISTER: 'register',
		VERIFY: 'verify',
		SECURITY: 'security',
		BILL: 'bill',
		UPDATE: 'update',
		MARKETING: 'marketing',
		SOCIAL: 'social'
	}
}

export const aiTaskConst = {
	type: {
		DAILY_DIGEST: 'daily_digest',
		IDENTITY_DISCOVERY: 'identity_discovery',
		SECURITY_SCAN: 'security_scan',
		EMAIL_ANALYSIS: 'email_analysis'
	},
	status: {
		PENDING: 0,
		PROCESSING: 1,
		DONE: 2,
		FAILED: 3
	}
}

export const securityConst = {
	type: {
		PASSWORD_CHANGE: 'password_change',
		ABNORMAL_LOGIN: 'abnormal_login',
		PHISHING: 'phishing',
		SUSPICIOUS: 'suspicious',
		DATA_BREACH: 'data_breach'
	},
	riskLevel: {
		LOW: 0,
		MEDIUM: 1,
		HIGH: 2
	},
	status: {
		UNPROCESSED: 0,
		CONFIRMED: 1,
		IGNORED: 2,
		RESOLVED: 3
	}
}

export const aiProviderConst = {
	WORKERS_AI: 0,
	DEEPSEEK: 1,
	CUSTOM: 2
}
