
NEXT_PUBLIC_SITE_URL=https://thecodebootcamp.com              # prod
NEXT_PUBLIC_SITE_URL=https://codingbootcamp-omega.vercel.app  # preview
NEXT_PUBLIC_SITE_URL=http://localhost:3000                    # local

AUTH_SECRET=********
AUTH_GITHUB_ID=******
AUTH_GITHUB_SECRET=********
NEXTAUTH_URL=http://localhost:3000


dev branch  - http://localhost:3000
prod branch - https://codingbootcamp-omega.vercel.app/


github developer settings > create new 0auth App 
    > codebootcamp (dev)
        url - http://localhost:3000
        auth callback url - http://localhost:3000/api/auth/callback/github
    > codebootcamp  (prod)
        url - https://codingbootcamp-omega.vercel.app/
        auth callback url - https://codingbootcamp-omega.vercel.app/api/auth/callback/github