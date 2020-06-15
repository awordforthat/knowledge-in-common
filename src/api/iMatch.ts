export interface IMatch {
  username: string;
  userId: string;
  topic: string;
}

export interface IPendingMatch {
  topic: string;
  requester: string;
  teacher: string;
  learner: string;
  teacherName: string;
  learnerName: string;
}
