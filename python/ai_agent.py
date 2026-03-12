from fastapi import FastAPI
from pydantic import BaseModel
from google import genai
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware


# Load .env file
load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# # Load OpenAI API key from environment variable
# client = OpenAI(
#     api_key=os.getenv("OPENAI_API_KEY")
# )


# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client()

class Prompt(BaseModel):
    prompt: str


@app.post("/generate")
async def generate(data: Prompt):

    try:
        # Gemini request
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"You are an AI coding assistant inside VS Code.\n\nUser request: {data.prompt}"
        )

        return {
            "code": response.text
        }

    except Exception as e:
        return {
            "code": f"Error: {str(e)}"
        }

