from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta
from . import models, schemas, crud, auth
from .database import SessionLocal, engine
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from .ai_core.therapist_recommender import predict_weaknesses_binary

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication
@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    therapist = crud.get_therapist_by_email(db, email=form_data.username)
    if not therapist or not auth.verify_password(form_data.password, therapist.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": therapist.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Therapist Endpoints
@app.post("/therapists/", response_model=schemas.Therapist)
def create_therapist(therapist: schemas.TherapistCreate, db: Session = Depends(get_db)):
    db_therapist = crud.get_therapist_by_email(db, email=therapist.email)
    if db_therapist:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_therapist(db=db, therapist=therapist)

# Child Endpoints
@app.post("/children/", response_model=schemas.Child)
def create_child(child: schemas.ChildCreate, db: Session = Depends(get_db)):
    return crud.create_child(db=db, child=child)

@app.get("/therapists/{therapist_id}/children/", response_model=List[schemas.Child])
def read_children_by_therapist(therapist_id: int, db: Session = Depends(get_db)):
    return crud.get_children_by_therapist(db=db, therapist_id=therapist_id)

# GameContent Endpoints
@app.post("/game-content/", response_model=schemas.GameContent)
def create_game_content(game_content: schemas.GameContentCreate, db: Session = Depends(get_db)):
    return crud.create_game_content(db=db, game_content=game_content)

@app.put("/game-content/{game_id}/difficulty/", response_model=schemas.GameContent)
def update_game_difficulty(game_id: int, difficulty: str, db: Session = Depends(get_db)):
    return crud.update_game_difficulty(db=db, game_id=game_id, difficulty=difficulty)

# GameSession Endpoints
@app.post("/game-sessions/", response_model=schemas.GameSession)
def create_game_session(session: schemas.GameSessionCreate, db: Session = Depends(get_db)):
    return crud.create_game_session(db=db, session=session)

# GameResult Endpoints
@app.post("/game-results/", response_model=schemas.GameResult)
def create_game_result(result: schemas.GameResultCreate, db: Session = Depends(get_db)):
    return crud.create_game_result(db=db, result=result)

@app.get("/children/{child_id}/results/", response_model=List[schemas.GameResult])
def read_results_by_child(child_id: int, db: Session = Depends(get_db)):
    return crud.get_results_by_child(db=db, child_id=child_id)

# TherapistFeedback Endpoints
@app.post("/feedback/", response_model=schemas.TherapistFeedback)
def create_therapist_feedback(feedback: schemas.TherapistFeedbackCreate, db: Session = Depends(get_db)):
    return crud.create_therapist_feedback(db=db, feedback=feedback)

@app.put("/feedback/{feedback_id}/recommendations/", response_model=schemas.TherapistFeedback)
def add_model_recommendations(feedback_id: int, recommendations: dict, db: Session = Depends(get_db)):
    return crud.add_model_recommendations_to_feedback(db=db, feedback_id=feedback_id, recommendations=recommendations)

# AI Model Endpoint
@app.post("/feedback/recommendations/")
def get_model_recommendations(feedback_text: str):
    return predict_weaknesses_binary(feedback_text)

@app.get("/")
def read_root():
    return {"testing": "conn"}
