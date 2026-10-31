export type Book = {
  id: number;
  title: string;
  author: string;
  read: boolean;
};

export type NewBook = {
  title: string;
  author: string;
};

/** An in-memory reading list. Each server process owns one store. */
export class BookStore {
  private books: Book[] = [];
  private nextId = 1;

  add(input: NewBook): Book {
    const book: Book = { id: this.nextId++, title: input.title, author: input.author, read: false };
    this.books.push(book);
    return book;
  }

  get(id: number): Book | undefined {
    return this.books.find((b) => b.id === id);
  }

  /** Books in the order they were added. `limit` caps how many come back. */
  list(limit?: number): Book[] {
    if (limit === undefined) return [...this.books];
    return this.books.slice(0, limit);
  }

  markRead(id: number): Book | undefined {
    const book = this.get(id);
    if (book) book.read = true;
    return book;
  }
}
