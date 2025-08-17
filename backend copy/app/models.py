from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class Therapist(Base):
    __tablename__ = 'therapists'
    therapist_id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    children = relationship("Child", back_populates="therapist")
    feedback = relationship("TherapistFeedback", back_populates="therapist")

class Child(Base):
    __tablename__ = 'children'
    child_id = Column(Integer, primary_key=True, index=True)
    therapist_id = Column(Integer, ForeignKey('therapists.therapist_id'))
    first_name = Column(String)
    email = Column(String, unique=True, index=True, nullable=True)
    date_of_birth = Column(DateTime)
    learning_profile = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    therapist = relationship("Therapist", back_populates="children")
    sessions = relationship("GameSession", back_populates="child")

class GameContent(Base):
    __tablename__ = 'game_content'
    game_id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    disorder_type = Column(String)
    difficulty_level = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    sessions = relationship("GameSession", back_populates="game")

class GameSession(Base):
    __tablename__ = 'game_sessions'
    session_id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey('children.child_id'))
    game_id = Column(Integer, ForeignKey('game_content.game_id'))
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)
    child = relationship("Child", back_populates="sessions")
    game = relationship("GameContent", back_populates="sessions")
    results = relationship("GameResult", back_populates="session")

class GameResult(Base):
    __tablename__ = 'game_results'
    result_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey('game_sessions.session_id'))
    score = Column(Integer)
    time_taken_seconds = Column(Float)
    feedback_data = Column(JSON)
    session = relationship("GameSession", back_populates="results")

class TherapistFeedback(Base):
    __tablename__ = 'therapist_feedback'
    feedback_id = Column(Integer, primary_key=True, index=True)
    therapist_id = Column(Integer, ForeignKey('therapists.therapist_id'))
    session_date = Column(DateTime, default=datetime.datetime.utcnow)
    feedback_data = Column(JSON)
    model_recommendations = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    therapist = relationship("Therapist", back_populates="feedback")
