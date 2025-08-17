from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# Therapist Schemas
class TherapistBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

class TherapistCreate(TherapistBase):
    password: str

class Therapist(TherapistBase):
    therapist_id: int

    class Config:
        orm_mode = True

# Child Schemas
class ChildBase(BaseModel):
    first_name: str
    email: Optional[EmailStr] = None
    date_of_birth: datetime
    learning_profile: Optional[dict] = None

class ChildCreate(ChildBase):
    therapist_id: int

class Child(ChildBase):
    child_id: int
    therapist_id: int

    class Config:
        orm_mode = True

# GameContent Schemas
class GameContentBase(BaseModel):
    title: str
    description: str
    disorder_type: str
    difficulty_level: str

class GameContentCreate(GameContentBase):
    pass

class GameContent(GameContentBase):
    game_id: int

    class Config:
        orm_mode = True

# GameSession Schemas
class GameSessionBase(BaseModel):
    child_id: int
    game_id: int

class GameSessionCreate(GameSessionBase):
    pass

class GameSession(GameSessionBase):
    session_id: int
    completed_at: datetime

    class Config:
        orm_mode = True

# GameResult Schemas
class GameResultBase(BaseModel):
    score: int
    time_taken_seconds: float
    feedback_data: Optional[dict] = None

class GameResultCreate(GameResultBase):
    session_id: int

class GameResult(GameResultBase):
    result_id: int
    session_id: int

    class Config:
        orm_mode = True

# TherapistFeedback Schemas
class TherapistFeedbackBase(BaseModel):
    session_date: datetime
    feedback_data: dict
    model_recommendations: Optional[dict] = None

class TherapistFeedbackCreate(TherapistFeedbackBase):
    therapist_id: int

class TherapistFeedback(TherapistFeedbackBase):
    feedback_id: int
    therapist_id: int
    created_at: datetime

    class Config:
        orm_mode = True
