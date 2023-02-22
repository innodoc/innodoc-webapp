declare namespace Express {
  export interface Request {
    /** Course object */
    course?: import('#types/entities/course').ApiCourse

    /** URL path without locale */
    urlWithoutLocale?: string
  }
}
