import type {User} from "./User";

export type UserSerQuestion = {
    user : User,
    secq_id : string,
    question : string,
    answer : string,
    createtime : string,
    state : string
};