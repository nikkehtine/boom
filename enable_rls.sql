ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmark_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY bookmarks_isolation ON bookmarks
    USING (user_id = current_setting('app.current_user_id', true)::int)
    WITH CHECK (user_id = current_setting('app.current_user_id', true)::int);

CREATE POLICY tags_isolation ON tags
    USING (user_id = current_setting('app.current_user_id', true)::int)
    WITH CHECK (user_id = current_setting('app.current_user_id', true)::int);

CREATE POLICY bookmark_tags_isolation ON bookmark_tags
    USING (
        bookmark_id IN (
            SELECT id FROM bookmarks WHERE user_id = current_setting('app.current_user_id', true)::int
        )
    )
    WITH CHECK (
        bookmark_id IN (
            SELECT id FROM bookmarks WHERE user_id = current_setting('app.current_user_id', true)::int
        )
    );
