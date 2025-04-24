export interface Loan {
    id: string
    type: string
    stage: string
    status: string
    amount: number
    interest: string
    period: number
    scheduleType: string
    risk: string
    images: string[]
    country: string
    countryFlag: string
    investors: number
    daysLeft: number
    fundingPercentage: number
    amountRaised: number
    amountLeft: number
    listingDate: Date
    constructionYear?: number
  }
  