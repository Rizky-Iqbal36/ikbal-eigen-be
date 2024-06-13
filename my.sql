SELECT b.id As id,
    b.stocks AS stocks,
    COUNT(bh.id) AS borrowed
FROM book b
    LEFT JOIN borrow_history bh ON b.id = bh.bookId
WHERE b.id = 1
GROUP BY b.id