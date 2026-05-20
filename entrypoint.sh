#!/bin/sh
set -e

# Start opencode serve in background
opencode serve --hostname 0.0.0.0 --port 4096 --cors "*" &
OPENCODE_PID=$!

echo "Waiting for opencode..."
READY=0
for i in $(seq 1 30); do
  if node -e "
    const h = require('http');
    const b = Buffer.from('${OPENCODE_SERVER_USERNAME}:${OPENCODE_SERVER_PASSWORD}').toString('base64');
    const req = h.get({hostname:'127.0.0.1',port:4096,path:'/global/health',headers:{Authorization:'Basic '+b}},r=>{
      r.resume();
      process.exit(r.statusCode===200?0:1);
    });
    req.setTimeout(1000, () => {
      req.destroy();
      process.exit(1);
    });
    req.on('error',()=>process.exit(1));
  " 2>/dev/null; then
    echo "opencode ready"
    READY=1
    break
  fi
  sleep 1
done

if [ "$READY" -ne 1 ]; then
  echo "opencode health-check timeout, starting nginx anyway"
fi

echo "Starting nginx..."
nginx -g "daemon off;"
