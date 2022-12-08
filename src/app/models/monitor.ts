export interface monitor {
    id: string,
    city: string,
    zip: number,
    refresh_interval: number,
    refresh_interval_milliseconds: number,
    last_temp_registered: number,
    alert_temp: number,
    alert_criteria: string,
    notify: boolean,
    favorite: boolean
}

export interface searchResult {
    city: string,
    temp: string
    zip?: number | null
}