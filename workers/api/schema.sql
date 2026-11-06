-- Anonymous weekly counts. No user id, no IP, no timestamp finer than the week.
CREATE TABLE IF NOT EXISTS chorus (week TEXT NOT NULL, kind TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (week, kind));
