from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Dent AI Analysis Service")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-service"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
