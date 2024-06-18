bun build --compile --sourcemap ./jam_auth.ts --outfile jam_auth # --minify flag breaks discord.js interaction handling; do not use it
sudo cp jam_auth /lib/x86_64-linux-gnu/security/;

gcc -fPIC -c pam_jam.c -o pam_jam.o;
gcc -shared -o pam_jam.so pam_jam.o -lpam;
sudo cp pam_jam.so /lib/x86_64-linux-gnu/security/;