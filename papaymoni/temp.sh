# 1. Make sure you're in the pp-ui repository root
cd /Users/michaeljohn/Documents/repositories/pp-ui

# 2. Create the papaymoni directory
mkdir papaymoni

# 3. Move all files and directories except .git and the new papaymoni folder
# First, let's create a temporary script to do this
cat > move_files.sh << 'EOF'
#!/bin/bash
for item in *; do
  if [ "$item" != "papaymoni" ] && [ "$item" != ".git" ] && [ "$item" != "move_files.sh" ]; then
    mv "$item" papaymoni/
  fi
done
for item in .[!.]*; do
  if [ "$item" != ".git" ]; then
    mv "$item" papaymoni/
  fi
done
EOF

# 4. Make the script executable and run it
chmod +x move_files.sh
./move_files.sh

# 5. Remove the temporary script
rm move_files.sh

# 6. Add and commit the changes
git add .
git commit -m "Restructured repository: moved all content to papaymoni subdirectory"

# 7. Push the changes
git push origin master
