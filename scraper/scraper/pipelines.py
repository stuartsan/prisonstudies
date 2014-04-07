# -*- coding: utf-8 -*-
from countrycode_lookup import lookup

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

class ScraperPipeline(object):
    def process_item(self, item, spider):
        if not item['name'] in lookup:
            raise LookupError('Hey I could not find that country code!')
        else:
            item['country_code'] = lookup[item['name']]
        return item
