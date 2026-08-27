if [ "$GIT_AUTHOR_EMAIL" = "noreply@lovable.dev" ] || \
   [ "$GIT_AUTHOR_EMAIL" = "159125892+gpt-engineer-app[bot]@users.noreply.github.com" ] || \
   [ "$GIT_AUTHOR_NAME" = "lovable" ] || \
   [ "$GIT_AUTHOR_NAME" = "Lovable" ] || \
   [ "$GIT_AUTHOR_NAME" = "gpt-engineer-app[bot]" ]; then
    export GIT_AUTHOR_NAME="Mister-Halder"
    export GIT_AUTHOR_EMAIL="debashishalder185@gmail.com"
fi
if [ "$GIT_COMMITTER_EMAIL" = "noreply@lovable.dev" ] || \
   [ "$GIT_COMMITTER_EMAIL" = "159125892+gpt-engineer-app[bot]@users.noreply.github.com" ] || \
   [ "$GIT_COMMITTER_NAME" = "lovable" ] || \
   [ "$GIT_COMMITTER_NAME" = "Lovable" ] || \
   [ "$GIT_COMMITTER_NAME" = "gpt-engineer-app[bot]" ]; then
    export GIT_COMMITTER_NAME="Mister-Halder"
    export GIT_COMMITTER_EMAIL="debashishalder185@gmail.com"
fi
