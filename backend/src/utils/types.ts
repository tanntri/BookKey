import { type User } from '@prisma/client'
import { type Request } from 'express'

export type ExpressRequest = Request & {
    user: User | undefined
}

export interface BookResponse {
    description: {
      type: string;
      value: string;
    };
    links: Record<string, any>[];
    title: string;
    dewey_number: string[];
    covers: number[];
    subject_places: string[];
    first_publish_date: string;
    subject_people: string[];
    key: string;
    authors: Record<string, any>[];
    subject_times: string[];
    type: {
      key: string;
    };
    subjects: string[];
    lc_classifications: string[];
    latest_revision: number;
    revision: number;
    created: {
      type: string;
      value: string;
    };
    last_modified: {
      type: string;
      value: string;
    };
}

export interface AuthorResponse {
    author: { key: string },
    type: { key: string }
}