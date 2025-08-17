from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Therapist CRUD
def get_therapist_by_email(db: Session, email: str):
    return db.query(models.Therapist).filter(models.Therapist.email == email).first()

def create_therapist(db: Session, therapist: schemas.TherapistCreate):
    hashed_password = pwd_context.hash(therapist.password)
    db_therapist = models.Therapist(
        email=therapist.email,
        password_hash=hashed_password,
        first_name=therapist.first_name,
        last_name=therapist.last_name,
    )
    db.add(db_therapist)
    db.commit()
    db.refresh(db_therapist)
    return db_therapist

# Child CRUD
def create_child(db: Session, child: schemas.ChildCreate):
    db_child = models.Child(**child.dict())
    db.add(db_child)
    db.commit()
    db.refresh(db_child)
    return db_child

def get_children_by_therapist(db: Session, therapist_id: int):
    return db.query(models.Child).filter(models.Child.therapist_id == therapist_id).all()

# GameContent CRUD
def create_game_content(db: Session, game_content: schemas.GameContentCreate):
    db_game_content = models.GameContent(**game_content.dict())
    db.add(db_game_content)
    db.commit()
    db.refresh(db_game_content)
    return db_game_content

def update_game_difficulty(db: Session, game_id: int, difficulty: str):
    db_game = db.query(models.GameContent).filter(models.GameContent.game_id == game_id).first()
    if db_game:
        db_game.difficulty_level = difficulty
        db.commit()
        db.refresh(db_game)
    return db_game

# GameSession CRUD
def create_game_session(db: Session, session: schemas.GameSessionCreate):
    db_session = models.GameSession(**session.dict())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

# GameResult CRUD
def create_game_result(db: Session, result: schemas.GameResultCreate):
    db_result = models.GameResult(**result.dict())
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

def get_results_by_child(db: Session, child_id: int):
    return db.query(models.GameResult).join(models.GameSession).filter(models.GameSession.child_id == child_id).all()

# TherapistFeedback CRUD
def create_therapist_feedback(db: Session, feedback: schemas.TherapistFeedbackCreate):
    db_feedback = models.TherapistFeedback(
        therapist_id=feedback.therapist_id,
        session_date=feedback.session_date,
        feedback_data=feedback.feedback_data
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def add_model_recommendations_to_feedback(db: Session, feedback_id: int, recommendations: dict):
    db_feedback = db.query(models.TherapistFeedback).filter(models.TherapistFeedback.feedback_id == feedback_id).first()
    if db_feedback:
        db_feedback.model_recommendations = recommendations
        db.commit()
        db.refresh(db_feedback)
    return db_feedback
