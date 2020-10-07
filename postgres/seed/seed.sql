BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) VALUES ('vish', 'vish@gmail.com', 5, '2020-5-20');
INSERT INTO login (hash, email) VALUES ('$2a$10$YjeZW3hPBfgwk.q8Eo4svewoC7WxlFfVDmAbyo6ZXd50zQKwuOuX6', 'vish@gmail.com');

COMMIT;