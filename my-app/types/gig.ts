export interface Gig{
    title: string,
    description: string,
    place: string,
    location: string,
    rate: number,
    people: number,
    date: Date,
    hours: number,
    startTime: string,
    endTime: string,
    tags: string[],
    requirements: string[]
}