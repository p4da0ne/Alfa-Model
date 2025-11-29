from pydantic import BaseModel

class FrontendInput(BaseModel):
    client_id: int                   #FrontendInput содержит только 1-5 признаков с формы на фронте
