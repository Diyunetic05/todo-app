export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: string;
    fromAPI?: boolean;
}

export interface ApiTodo {
    id: number;
    title: string;
    completed: boolean;
    userId?: number;
}