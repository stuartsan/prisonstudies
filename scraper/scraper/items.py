from scrapy.item import Item, Field

class Country(Item):
  name                             = Field()
  total_prisoners                  = Field()
  total_prisoners_comment          = Field()
  prison_pop_rate                  = Field()
  prison_pop_rate_comment          = Field()
  pretrial_detainee_rate           = Field()
  pretrial_detainee_rate_comment   = Field()
  female_prisoners                 = Field()
  female_prisoners_comment         = Field()
  juveniles                        = Field()
  juveniles_comment                = Field()
  total_establishments             = Field()
  total_establishments_comment     = Field()
  foreign_prisoners                = Field()
  foreign_prisoners_comment        = Field()
  official_capacity                = Field()
  official_capacity_comment        = Field()
  occupancy_level                  = Field()
  occupancy_level_comment          = Field()
  pso_url                          = Field()

