import re
from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.selector import Selector
from scraper.items import Country

class PrisonStudiesSpider(CrawlSpider):
  name = 'prisonstudies'
  allowed_domains = ['prisonstudies.org']
  start_urls = [ 
    'http://www.prisonstudies.org/map/africa',
    'http://www.prisonstudies.org/map/asia',
    'http://www.prisonstudies.org/map/caribbean',
    'http://www.prisonstudies.org/map/central-america',
    'http://www.prisonstudies.org/map/europe',
    'http://www.prisonstudies.org/map/middle-east',
    'http://www.prisonstudies.org/map/north-america',
    'http://www.prisonstudies.org/map/oceania',
    'http://www.prisonstudies.org/map/south-america',
  ]
  rules = [Rule(SgmlLinkExtractor(allow=['/country/.+[^#\/]']), 'parse_country')]
  
  def extractPercentage(self, lst):
    if not lst:
      return None
      
    str = lst[0].extract()
    return (None if not str else float(str[:-1]))
  
  def extractInteger(self, lst):
    if not lst:
      return None

    str = lst[0].extract()
    return (None if not str else int(str.replace(' ', '')))

  def extractString(self, lst):
    if not lst:
      return None
    
    return lst[0].extract()

  def extractTrends(self, lst):
    if not lst:
        return None

    def extract(idx, sel):
        data = sel.css('td span::text').extract()[0] if idx == 0 else sel.css('td::text').extract()[0]
        return int(re.search(r'\d+', data.strip().replace(',', '')).group())

    cells = [row.css('td') for row in lst]
    extracted = [[extract(idx, sel) for (idx, sel) in enumerate(row) ] for row in cells]
    return extracted


  def parse_country(self, response):
    
    #First grab all the stuff we need via CSS selectors
    sel = Selector(response)
    name = sel.css('#basic_data table:first-child .field-content strong::text')
    total_prisoners = sel.css('.field-collection-item-field-prison-population-total .field-name-field-integer .field-item::text')
    total_prisoners_comment = sel.css('.field-collection-item-field-prison-population-total .field-name-field-comment .field-item::text')
    prison_pop_rate = sel.css('.field-collection-item-field-prison-population-rate .field-name-field-integer .field-item::text')
    prison_pop_rate_comment = sel.css('.field-collection-item-field-prison-population-rate .field-name-field-comment .field-item::text')
    pretrial_detainee_rate = sel.css('.field-collection-item-field-pre-trial-detainees .field-name-field-percentage .field-item::text')
    pretrial_detainee_rate_comment = sel.css('.field-collection-item-field-pre-trial-detainees .field-name-field-comment .field-item::text')
    female_prisoners = sel.css('.field-collection-item-field-female-prisoners .field-name-field-percentage .field-item::text')        
    female_prisoners_comment = sel.css('.field-collection-item-field-female-prisoners .field-name-field-comment .field-item::text')          
    juveniles = sel.css('.field-collection-item-field-juveniles .field-name-field-percentage .field-item::text')
    juveniles_comment = sel.css('.field-collection-item-field-juveniles .field-name-field-comment .field-item::text')
    total_establishments = sel.css('.field-collection-item-field-number-of-establishments .field-name-field-integer .field-item::text')
    total_establishments_comment = sel.css('.field-collection-item-field-number-of-establishments .field-name-field-comment .field-item::text')
    official_capacity = sel.css('.field-collection-item-field-official-capacity .field-name-field-integer .field-item::text')
    official_capacity_comment = sel.css('.field-collection-item-field-official-capacity .field-name-field-comment .field-item::text')
    foreign_prisoners = sel.css('.field-collection-item-field-foreign-prisoners .field-name-field-percentage .field-item::text')
    foreign_prisoners_comment = sel.css('.field-collection-item-field-foreign-prisoners .field-name-field-comment .field-item::text') 
    occupancy_level =  sel.css('.field-collection-item-field-occupancy-level .field-name-field-percentage .field-item::text') 
    occupancy_level_comment =  sel.css('.field-collection-item-field-occupancy-level .field-name-field-comment .field-item::text') 
    trend = sel.css('.view-data-previous-year-prison-population-trend .views-table tr')

    #Then plug it in here
    item = Country()
    item['name'] = self.extractString(name)                          
    item['total_prisoners'] = self.extractInteger(total_prisoners)
    item['total_prisoners_comment'] = self.extractString(total_prisoners_comment)
    item['prison_pop_rate'] = self.extractInteger(prison_pop_rate)
    item['prison_pop_rate_comment'] = self.extractString(prison_pop_rate_comment)
    item['pretrial_detainee_rate'] = self.extractPercentage(pretrial_detainee_rate)
    item['pretrial_detainee_rate_comment'] = self.extractString(pretrial_detainee_rate_comment)
    item['female_prisoners'] = self.extractPercentage(female_prisoners)
    item['female_prisoners_comment'] = self.extractString(female_prisoners_comment)
    item['juveniles'] = self.extractPercentage(juveniles)
    item['juveniles_comment'] = self.extractString(juveniles_comment)
    item['total_establishments'] = self.extractInteger(total_establishments)
    item['total_establishments_comment'] = self.extractString(total_establishments_comment)
    item['foreign_prisoners'] = self.extractPercentage(foreign_prisoners)
    item['foreign_prisoners_comment'] = self.extractString(foreign_prisoners_comment)
    item['official_capacity'] = self.extractInteger(official_capacity)
    item['official_capacity_comment'] = self.extractString(official_capacity_comment)
    item['occupancy_level'] = self.extractPercentage(occupancy_level)
    item['occupancy_level_comment'] = self.extractString(occupancy_level_comment)
    item['trend'] = self.extractTrends(trend)
    item['pso_url'] = response.url

    return item


